import React, { useEffect, useState } from "react";
import Img from "../img/background.jpg";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SuggestionBox from "./SuggestionBox";

export default function BgImg() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [results, setResults] = useState("");

	// Adreslarni to'plash uchun funksiya
	const getAddressList = async () => {
		const listingsRef = collection(db, "listings");
		const snapshot = await getDocs(listingsRef);

		// Adreslarni saqlash uchun bo'sh massiv
		const addressList = [];

		snapshot.forEach((doc) => {
			const listing = doc.data();
			const address = listing.address;
			// console.log(address);
			
			// Har bir adresni addressList massiviga qo'shing
			addressList.push(address);
		});

		return addressList;
	};

	// 
	const removeDuplicates = (array) => {
		// ['Fergana ', 'Fergana', 'Fergana', 'Uzbekistan Fergana'] 
		const uniqueArray = [];
		array.forEach((element) => {
			if (!uniqueArray.includes(element) ) {
				uniqueArray.push(element);
			}
		});
		return uniqueArray;
	};

	useEffect(() => {
		const handleSearch = async (value) => {
			try {
				const addresses = await getAddressList(value);
				const results = addresses.filter((address) => value && value.length > 0 && address && address.toLowerCase().includes(value.toLowerCase()));
				console.log(results);
				// console.log(value);
				// setResults(results);
				const uniqueResults = removeDuplicates(results);
				setResults(uniqueResults);
			} catch (error) {
				console.log("Adreslarni olishda xato:", error);
			}
		};
		handleSearch(search);
	
	},[search])
	
	const handleChange = (value) => {
		setSearch(value);
		getAddressList(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (search === "") {
			return;
		} else {
			navigate(`/searched-place?name=${search}`);
			setSearch("");
		}
	};
	return (
		<>
			<div
				className="h-[600px] relative "
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Img})`,
					backgroundSize: "cover",
					marginTop: "-100px",
				}}
			>
				<div className="absolute top-[240px]  w-full">
					<div>
						<p className="text-white  mx-auto text-center font-semibold text-4xl sm:text-5xl">
							Yangi uyingizni kashf eting
						</p>
					</div>

					<div className="flex justify-center mt-10">
						<form
							onSubmit={handleSubmit}
							className="w-[80%] sm:w-[50%] flex relative"
						>
							<input
								type="text"
								id="name"
								value={search}
								onChange={(e) => handleChange(e.target.value)}
								placeholder="Manzil bo'yicha qidiring..."
								maxLength="32"
								required
								className="text-sm   sm:text-xl w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 search-input"
							/>
							{}
							<button
								onClick={handleSubmit}
								className="text-[#de9e7c] absolute right-0 bottom-4 md:bottom-auto  md:top-0  p-[11px]"
							>
								{window.innerWidth <= 640 ? (
									<SearchIcon
										className=" bg-[#F07E49] text-white rounded-full  "
										sx={{ fontSize: 32 }}
									/>
								) : (
									"Qidirish"
								)}
							</button>
						</form>
					</div>
					<SuggestionBox results={results}/>
				</div>
			</div>
		</>
	);
}