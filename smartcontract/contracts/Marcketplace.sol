// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Pausable, ReentrancyGuard {

	using SafeMath for uint;

	/** state variables  */

	// define enum to store state for each product
	enum State {
		ForSale,
		Sold
	}

	// struct to keep all required data for a single product 
	struct Product {
		uint id;
		string name;
		uint price;
		State state;
		address payable seller;
		address payable buyer;
	}

	// store a mapping for products
	mapping(uint => Product) public products;

	// store products count
	uint public productsCount;

	// store owner of the contract
	address owner;

	/** modifiers  */

	modifier onlySeller(uint _productId) {
		require(
			products[_productId].seller == msg.sender,
			"only seller of the product has right to call this function"
		);
		_;
	}

	modifier notSeller(uint _productId) {
		require(
			products[_productId].seller != msg.sender,
			"seller of the product can not call this function"
		);
		_;
	}

	modifier forSale(uint _productId) {
		require(
			products[_productId].state == State.ForSale && products[_productId].price >= 0
		);
		_;
	}

	modifier sold(uint _productId) {
		require(
			products[_productId].state == State.Sold && products[_productId].buyer != address(0)
		);
		_;
	}

	modifier paidEnough(uint _price) {
		require(
			msg.value >= _price,
			"please provide enouph value in the transaction!"
		);
		_;
	}

	// refund users after pay for items
	modifier refundUser(uint _productId) {
		_;
		uint refundAmount = msg.value - products[_productId].price;
		products[_productId].buyer.transfer(refundAmount);
	}

	modifier validProductId(uint _productId) {
		require(
			products[_productId].id == _productId,
			"please provide a valid product id"
		);
		_;
	}


	/** Events */

	event LogForSale(uint _productId);

	event LogSold(uint _productId);

	event ProductAdded(uint _productId);

	event ProductModified(uint _productId);

	event ProductRemoved(uint _productId);

	constructor() {
		// set owner of the contract
		owner = msg.sender;

		// initializing products count
		productsCount = 0;
	}

	/** Add new product */
	function addProduct(
		string memory _name,
		uint _price
	)
	public
	whenNotPaused()
	returns (bool)
	{
		products[productsCount] = Product({
		id : productsCount,
		name : _name,
		price : _price, // in wei
		state : State.ForSale,
		seller : payable(msg.sender),
		buyer : payable(address(0))
		});
		emit ProductAdded(productsCount);
		emit LogForSale(productsCount);
		productsCount++;
		return true;
	}


	function buyProduct(uint _productId)
	public
	payable
	validProductId(_productId)
	forSale(_productId)
	notSeller(_productId)
	paidEnough(products[_productId].price)
	refundUser(_productId)
	whenNotPaused()
	nonReentrant()
	returns (bool)
	{
		// (bool success,) = payable(products[_productId].seller).call{value: products[_productId].price ether}("");
		// require(success, "transaction failed");
		payable(products[_productId].seller).transfer(products[_productId].price);
		products[_productId].buyer = payable(msg.sender);
		products[_productId].state = State.Sold;
		emit LogSold(_productId);
		return true;
	}


	function removeProduct(uint _productId)
	public
	validProductId(_productId)
	forSale(_productId)
	onlySeller(_productId)
	whenNotPaused()
	returns (bool)
	{
		delete products[_productId];
		emit ProductRemoved(_productId);
		return true;
	}

	function modifyProduct(uint _productId, uint _newPrice)
	public
	validProductId(_productId)
	forSale(_productId)
	onlySeller(_productId)
	whenNotPaused()
	returns (bool)
	{
		products[_productId].price = _newPrice;
		emit ProductModified(_productId);
		return true;
	}

}