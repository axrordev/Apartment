import {
	collection,				
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

export default function SearchedNavbar({ minPrice, maxPrice }) {
	const [listings, setListings] = useState(null);


	useEffect(() => {
		async function fetchListings() {
			try {
				setListings(null);
				// get reference
				const listingsRef = collection(db, "listings");
				// create the query
				let q = query(
					listingsRef,
					orderBy("regularPrice"), // `regularPrice` bo'yicha tartiblash
					// orderBy("bedrooms"), // `bedrooms` bo'yich	
					orderBy("timestamp", "desc"), // `timestamp` bo'yicha tartiblash
				);

				if (minPrice !== null && minPrice !== "" && !isNaN(minPrice)) {
					q = query(q, where("regularPrice", ">=", Number(minPrice)));
				}

				if (maxPrice !== null && maxPrice !== "" && !isNaN(maxPrice)) {
					q = query(q, where("regularPrice", "<=", Number(maxPrice)));
				}

				// execute the query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					listings.push({
						id: doc.id,
						data: doc.data(),

						// {...doc.data(), regularPrice: Number(doc.data().regularPrice)},
					});
				});
				setListings(listings);
			} catch (error) {
				console.log(error);
			}
		}

		fetchListings();
	}, [minPrice, maxPrice]);

	return (
		<div>
			<div className="max-w-6xl mx-auto overlay ">
				{listings && listings.length > 0 ? (
					<div className="m-2 ">
						<h2 className="px-3 text-2xl mt-6 mb-4 font-semibold">
							Qidirilgan uylar
						</h2>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</div>
	);
}

