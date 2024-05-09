import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import SwiperCore, { Autoplay, Navigation, Pagination, Grid } from "swiper";
import "swiper/css/bundle";
import "../index.css";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import {
	FaMapMarkerAlt,
	FaBed,
	FaBath,
	FaParking,
	FaChair,
} from "react-icons/fa";

export default function Listing() {
	const auth = getAuth();
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [contactLandlord, setContactLandlord] = useState(false);
	SwiperCore.use([Autoplay, Navigation, Pagination]);
	useEffect(() => {
		async function fetchListing() {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		}
		fetchListing();
	}, [params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			<Swiper
				slidesPerView={2}
				grid={{
					rows: 1,
				}}
				spaceBetween={30}
				pagination={{
					clickable: true,
				}}
				effect="fade"
				autoplay={{ delay: 4000 }}
				modules={[Grid, Pagination]}
				className="w-100 h-100 ml-auto mr-auto "
				breakpoints={{
					// Ekran kengligi 768 pikseldan katta bo'lganda (planshet va kompyuter)
					768: {
						slidesPerView: 2,
					},
					// Ekran kengligi 480 pikseldan katta bo'lganda (telefon)
					250: {
						slidesPerView: 1,
					},
				}}
			>
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<div
							className="relative w-full overflow-hidden h-[400px]  "
							style={{
								background: `url(${listing.imgUrls[index]}) center `,
								backgroundSize: "cover",
							}}
						>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
				<div className=" w-full">
					<p className="text-2xl font-bold mb-3 text-blue-900">
						{listing.name} - ${" "}
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" ? " / OY" : ""}
					</p>
					<p className="flex items-center mt-6 mb-3 font-semibold">
						<FaMapMarkerAlt className="text-green-700 mr-1" />
						{listing.address}
					</p>
					<div className="flex justify-start items-center space-x-4 w-[75%]">
						<p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
							{listing.type === "rent" ? "Ijaraga olinadi" : "Sotiladi"}
						</p>
						{listing.offer && (
							<p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
								${+listing.regularPrice - +listing.discountedPrice} chegirma
							</p>
						)}
					</div>
					<p className="mt-3 mb-3">
						<span className="font-semibold">Uy haqida - </span>
						{listing.description}
					</p>
					<ul className="flex  flex-wrap justify-around md:justify-normal  md:flex-nowrap items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
						<li className="flex items-center whitespace-nowrap  ">
							<FaBed className="text-lg " />
						{listing.bedrooms} ta yotoq
						</li>
						<li className="flex items-center whitespace-nowrap ">
							<FaBath className="text-lg " />
							{listing.bathrooms} ta vanna
						</li>
						<li className="flex items-center whitespace-nowrap ">
							<FaParking className="text-lg " />
							{listing.parking ? "Turargoh bor" : "Turargoh yo'q"}
						</li>
						<li className="flex items-center whitespace-nowrap mt-2 md:mt-0 ">
							<FaChair className="text-lg " />
							{listing.furnished ? "Jixozlangan" : "Jixozlanmagan"}
						</li>
					</ul>
					{listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
						<div className="mt-6">
							<button
								onClick={() => setContactLandlord(true)}
								className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out "
							>
								Contact Landlord
							</button>
						</div>
					)}
					{contactLandlord && (
						<Contact userRef={listing.userRef} listing={listing} />
					)}
				</div>

				<div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
					<MapContainer
						center={[listing.geolocation.lat, listing.geolocation.lon]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "100%", width: "100%" }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lon]}
						>
							<Popup>{listing.address}</Popup>
						</Marker>
					</MapContainer>
					{console.log(listing.geolocation)}
				</div>
			</div>
		</main>
	);
}
