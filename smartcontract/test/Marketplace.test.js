const Marketplace = artifacts.require("./Marketplace.sol");
const {catchRevert} = require("./exceptionsHelpers");

contract("Marketplace", function (accounts) {
	const [owner, seller, buyer] = accounts;
	const nullAddress = "0x0000000000000000000000000000000000000000";
	const product = {
		price: "10000",
		name: "Table"
	};

	let marketplace;

	beforeEach(async () => {
		marketplace = await Marketplace.new({
			from: owner
		});
	});

	describe('addProduct', function () {
		let addProductResult = null;
		beforeEach(async () => {
			addProductResult = await marketplace.addProduct(
				product.name,
				product.price,
				{
					from: seller
				}
			);
		})

		it("emit ProductAdded", async () => {
			let eventEmitted = false;
			if (addProductResult.logs[0].event === "ProductAdded") {
				eventEmitted = true;
			}
			assert.equal(eventEmitted, true, 'adding a Product should emit ProductAdded event');
		});

		it("emit LogForSale", async () => {
			let eventEmitted = false;
			if (addProductResult.logs[1].event === "LogForSale") {
				eventEmitted = true;
			}
			assert.equal(eventEmitted, true, 'adding a Product should emit LogForSale event');
		});

		it("Add new product", async () => {
			const _product = await marketplace.products.call("0");

			assert.equal(
				_product[0].toString() === "0" &&
				_product[1].toString() === product.name &&
				_product[2].toString() === product.price &&
				_product[3].toString() === "0" &&
				_product[4].toString() === seller &&
				_product[5].toString() === nullAddress,
				true,
				'Product does not added'
			);
		});
	});


	describe("buyProduct", function() {
		let buyProductResult = null;
		beforeEach(async () => {
			const addProductResult = await marketplace.addProduct(
				product.name,
				product.price,
				{
					from: seller
				}
			);
			buyProductResult = await marketplace.buyProduct(
				"0",
				{
					from: buyer,
					value: product.price
				}
			)
		});

		it("product buyer should have been set", async () => {
			const _product = await marketplace.products.call("0");
			assert.equal(
				_product[0].toString() === "0" &&
				_product[3].toString() === "1" &&
				_product[4].toString() === seller &&
				_product[5].toString() === buyer,
				true,
				'Product buyer did not set'
			);
		})

		it("emit LogSold", async () => {
			let eventEmitted = false;
			if (buyProductResult.logs[0].event === "LogSold") {
				eventEmitted = true;
			}
			assert.equal(eventEmitted, true, 'buying a Product should emit LogSold event');
		});
	});


	describe("removeProduct", function() {
		let removeProductResult = null;
		beforeEach(async () => {
			
			const addProductResult = await marketplace.addProduct(
				product.name,
				product.price,
				{
					from: seller
				}
			);
			removeProductResult = await marketplace.removeProduct(
				"0",
				{
					from: seller
				}
			)
		});

		it("product should be removed", async () => {
			const _product = await marketplace.products.call("0");
			assert.equal(
				_product[0].toString() === "0" &&
				_product[1].toString() === "" &&
				_product[2].toString() === "0" &&
				_product[3].toString() === "0" &&
				_product[4].toString() === nullAddress &&
				_product[5].toString() === nullAddress,
				true,
				'Product did not removed'
			);
		});

		it("emit LogSold", async () => {
			let eventEmitted = false;
			if (removeProductResult.logs[0].event === "ProductRemoved") {
				eventEmitted = true;
			}
			assert.equal(eventEmitted, true, 'removing a Product should emit ProductRemoved event');
		});

	});

	describe("modifyProduct", function () {
		let modifyProductResult = null;
		beforeEach(async () => {
			const addProductResult = await marketplace.addProduct(
				product.name,
				product.price,
				{
					from: seller
				}
			);
			modifyProductResult = await marketplace.modifyProduct(
				"0",
				(Number(product.price) + 500).toString(),
				{
					from: seller
				}
			)
		});

		it("product price should be updated", async () => {
			const _product = await marketplace.products.call("0");
			assert.equal(
				_product[0].toString() === "0" &&
				_product[1].toString() === product.name &&
				_product[2].toString() === (Number(product.price) + 500).toString() &&
				_product[3].toString() === "0" &&
				_product[4].toString() === seller &&
				_product[5].toString() === nullAddress,
				true,
				'Product did not modified'
			);
		});

		it("emit ProductModified", async () => {
			let eventEmitted = false;
			if (modifyProductResult.logs[0].event === "ProductModified") {
				eventEmitted = true;
			}
			assert.equal(eventEmitted, true, 'modifing a Product should emit ProductModified event');
		});
	})
})