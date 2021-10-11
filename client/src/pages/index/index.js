import { newContextComponents } from "@drizzle/react-components";
import {Button, Divider, Form, Input, message} from "antd";
import {useState} from "react";
const { AccountData, ContractData, ContractForm } = newContextComponents;

const nullAddress = "0x0000000000000000000000000000000000000000";

const Index = ({drizzle, drizzleState}) => {
	// const [form] = Form.useForm();
	// const formProps = {
	// 	form,
	// 	layout: "horizontal",
	// 	onFinish(values) {
	// 		setProductId(Number(values.id));
	// 	}
	// }
	const ProductState = {
		ForSale: "For Sale",
		Sold: "Sold"
	}
	const [product, setProduct] = useState(null);
	const [getProductCalled, setGetProductCalled] = useState(false);
	const formProps = {
		async viewProductHandler(e) {
			try {
				e.preventDefault();
				setGetProductCalled(true);
				const result = await drizzle.contracts.Marketplace.methods.products(e.target.id.value).call();
				if(result?.seller?.toString() === nullAddress) {
					console.log("invaaaalid")
					setProduct(null);
				} else {
					setProduct({
						id: result?.id,
						name: result?.name,
						price: result?.price,
						state: Number(result?.state) ? ProductState.Sold : ProductState.ForSale,
						buyer: result?.buyer === nullAddress ? "No Buyer" : result?.buyer,
						seller: result?.seller,
					})
				}
			} catch (e) {
				message.error("Could not call smart contract");
			}
		},
		async buyProduct(e) {
			e.preventDefault();
			const {id, price} = e.target;
			console.log({id: id.value, price: price.value});

			const res = await drizzle.contracts.Marketplace.methods.buyProduct(id.value).send({
				from: drizzleState.accounts[0],
				value: price.value
			});

		}
	}
	return (
		<>
			<article className="index-page">

				<header>
					<div className="container">
						<h2>Marketplace</h2>
						<section className="products-count">
							<p>
								<span className="text">Total Products Count:</span>
								<span className="products-count">
							<ContractData
								drizzle={drizzle}
								drizzleState={drizzleState}
								contract="Marketplace"
								method="productsCount"
							/>
						</span>
							</p>
						</section>
					</div>
				</header>

				<section className="view-product">
					<div className="container">
						<h4>View Product</h4>
						<p>Please your desired product id to get it's information</p>
						<form onSubmit={formProps.viewProductHandler}>
							<input type="text" name={"id"} placeholder={"id"}/>
							<button type={"submit"}>Submit</button>
						</form>
						{
							// typeof productId === "number" &&
							// (
							// 	<>
							// 		<ContractData
							// 			drizzle={drizzle}
							// 			drizzleState={drizzleState}
							// 			contract="Marketplace"
							// 			method="products"
							// 			methodArgs={[productId]}
							// 		/>
							// 	</>
							// )
						}
						{
							getProductCalled &&
							product &&
							(
								<div className="table-wrapper">
									<table>
										<thead>
											<tr>
												<th>Property</th>
												<th>Value</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Id</td>
												<td>{product.id}</td>
											</tr>
											<tr>
												<td>Name</td>
												<td>{product.name}</td>
											</tr>
											<tr>
												<td>State</td>
												<td>{product.state}</td>
											</tr>
											<tr>
												<td>Price</td>
												<td>{product.price} wei(s)</td>
											</tr>
											<tr>
												<td>Seller</td>
												<td>{product.seller}</td>
											</tr>
											<tr>
												<td>Buyer</td>
												<td>{product.buyer}</td>
											</tr>
										</tbody>
									</table>
								</div>
							)
						}
						{
							getProductCalled &&
							!product &&
							(
								<div className="invalid-product">
									<p>Invalid Product</p>
								</div>
							)
						}
					</div>
				</section>

				<Divider />

				<section className="add-product">
					<div className="container">
						<h4>Add New Product</h4>
						<p>Fill the form below to add a new product into the smart contract</p>
						<ContractForm
							drizzle={drizzle}
							contract="Marketplace"
							method="addProduct"
							labels={["Name", "Price"]}
						/>
					</div>
				</section>

				<Divider />

				<section className="buy-product">
					<div className="container">
						{
							// <ContractForm
							// 	drizzle={drizzle}
							// 	contract="Marketplace"
							// 	method="buyProduct"
							// 	labels={["productId"]}
							// 	sendArgs={{
							// 		from: drizzleState.accounts[0],
							// 		value:
							// 	}}
							// />
						}
						<h4>Buy A Product</h4>
						<p>Fill the form below to buy a product (please first check the product information)</p>
						<form onSubmit={formProps.buyProduct}>
							<input type="text" name={"id"} placeholder={"id"}/>
							<input type="text" name={"price"} placeholder={"price"}/>
							<button type={"submit"}>Submit</button>
						</form>
					</div>
				</section>

				<Divider />

				<section className="modify-product">
					<div className="container">
						<h4>Modify A Product</h4>
						<p>Fill the form below to modify a product's price</p>
						<ContractForm
							drizzle={drizzle}
							contract="Marketplace"
							method="modifyProduct"
							labels={["productId", "newPrice"]}
						/>
					</div>
				</section>

				<Divider />

				<section className="remove-product container">
					<div className="container" style={{paddingBottom: 50}}>
						<h4>Remove A Product</h4>
						<p>Input the id of the product you wish to remove</p>
						<ContractForm
							drizzle={drizzle}
							contract="Marketplace"
							method="removeProduct"
							labels={["productId"]}
						/>
					</div>
				</section>

			</article>
		</>
	);
};

export default Index;