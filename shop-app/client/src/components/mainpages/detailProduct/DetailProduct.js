import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";

export default function DetailProduct() {
	const params = useParams();
	const state = useContext(GlobalState);
	const [products] = state.productsAPI.products;
	const [detailProduct, setDetailProduct] = useState([]);

	useEffect(() => {
		if (params) {
			products.forEach((product) => {
				if (product._id === params.id) setDetailProduct(product);
			});
		}
	}, [params, products]);

	if (detailProduct.length === 0) return null;
	console.log(products);
	return (
		<div className="container">
			<div className="detail">
				<img src={detailProduct.images.url} alt="product_img" />
				<div className="line"></div>
				<div className="box-detail">
					<div className="row">
						<h2>{detailProduct.title}</h2>
						<h6>{detailProduct.product_id}</h6>
					</div>
					<div className="content-detail">
						<span>$ {detailProduct.price}</span>
						<p>{detailProduct.description}</p>
						<p>{detailProduct.content}</p>
						<p>Sold: {detailProduct.sold}</p>
					</div>

					<div className="btn-group">
						<Link to="/cart" className="cart buy">
							Mua
						</Link>
						<Link to="/cart" className="cart like">
							Thích
						</Link>
					</div>
				</div>
			</div>
			<div>
				<h2>Sản Phẩm Liên Quan</h2>
				<div className="products">
					{products
						.filter((product) => product._id !== params.id)
						.map((product) => {
							return <ProductItem key={product._id} product={product} />;
						})}
				</div>
			</div>
		</div>
	);
}
