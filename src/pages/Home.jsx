import React from "react";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import BgImg from "../components/BgImg";


const Home = () => {
	// Offers
	const [offerListings, setOfferListings] = useState(null);
	const [limitValue, setLimitValue] = useState(4);

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth;
			console.log(windowWidth);

			if (windowWidth < 600) {
				setLimitValue(1);
			} else if (windowWidth < 900) {
				setLimitValue(2);
			} else if (windowWidth < 1024) {
				setLimitValue(3);
			} else {
				setLimitValue(4);
			}
		};

		handleResize(); // Set initial value

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// create the query
				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(limitValue),
				);
				// execute the query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setOfferListings(listings);
			} catch (error) {
				console.log(error);
			}
		}
		fetchListings();
	}, [limitValue]);

	// Places for rent
	const [rentListings, setRentListings] = useState(null);
	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// create the query
				const q = query(
					listingsRef,
					where("type", "==", "rent"),
					orderBy("timestamp", "desc"),
					limit(limitValue),
				);
				// execute the query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setRentListings(listings);
			} catch (error) {
				console.log(error);
			}
		}
		fetchListings();
	}, [limitValue]);

	// Places for sale
	const [saleListings, setSaleListings] = useState(null);
	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// create the query
				const q = query(
					listingsRef,
					where("type", "==", "sale"),
					orderBy("timestamp", "desc"),
					limit(limitValue),
				);
				// execute the query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setSaleListings(listings);
			} catch (error) {
				console.log(error);
			}
		}
		fetchListings();
	}, [limitValue]);

	return (
		<div className="">
			<BgImg />
			
			<div className="max-w-6xl mx-auto pt-4 space-y-6">
				{offerListings && offerListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">
							So'ngi takliflar
						</h2>
						<Link to="/offers">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Ko'proq ko'rsatish
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{offerListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
				{rentListings && rentListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">
							Ijaraga beriladigan uylar
						</h2>
						<Link to="/category/rent">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Ko'proq ko'rsatish
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{rentListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
				{saleListings && saleListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">Sotiladigan uy</h2>
						<Link to="/category/sale">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Ko'proq ko'rsatish
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{saleListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
