import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { useNavigate } from "react-router";

export default function SearchNavbar({ minPrice, onMinPriceChange, onMaxPriceChange, maxPrice, onMaxBedChange, onMinBedChange, minBed, maxBed, type, onChangeType}) {
	const [search, setSearch] = useState("");
	const [showModalPrice, setShowModalPrice] = useState(false);
	const [showModalBed, setShowModalBed] = useState(false);
	const [showModalType, setShowModalType] = useState(false);
	const [isLeaseChecked, setIsLeaseChecked] = useState(false);
	const [isSaleChecked, setIsSaleChecked] = useState(false);


	const maxPriceRef = useRef(null);
	const maxBedRef = useRef(null);
	const navigate = useNavigate();

	const handleLeaseCheckboxChange = () => {
		setIsLeaseChecked(!isLeaseChecked);
		setIsSaleChecked(false);
	};
	const handleSaleCheckboxChange = () => {
		setIsLeaseChecked(false);
		setIsSaleChecked(!isSaleChecked);
	};

	const onPrice = (e) => {
		setShowModalPrice(!showModalPrice);
		setShowModalBed(false);
		setShowModalType(false);
	};
	const onBed = () => {
		setShowModalBed(!showModalBed);
		setShowModalPrice(false);
		setShowModalType(false);
	};
	const onType = (e) => {
		setShowModalType(!showModalType);
		setShowModalBed(false);
		setShowModalPrice(false);
	};


	const handleChange = (value) => {
		setSearch(value);
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

	const handleMinPriceKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			maxPriceRef.current.focus();

		}
	};
	const handleMaxPriceKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setShowModalPrice(false);

		}
	};

	const handleMinBedKeydown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			maxBedRef.current.focus();
	}}

	const handleMaxBedKeydown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setShowModalBed(false);
	}}


	return (
		// <ListingContext.Provider value={listingsNavbar}>
			<div className="h-[60px] sticky flex  bg-[#F4F4F4] items-center z-[1000]">	
				<span className="p-2 mr-32  w-[100px]  ">
					<div className="">
						<form
							onSubmit={handleSubmit}
							className="w-[80%] sm:w-[50%] flex relative"
						>
							<input
								type="text"
								id="name"
								value={search}
								onChange={(e) => handleChange(e.target.value)}
								placeholder="Manzil ..."
								maxLength="32"
								required
								// className="text-sm   sm:text-xl w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 search-input"
								className="p-[9px] border  border-gray-400 rounded-sm focus:outline-none focus:ring-0  "
							/>
						</form>
					</div>
				</span>

				<span className="p-2 mr-3 ml-4 w-[100px] rounded-sm ">
					<div
						onClick={onPrice}
						className="hover:bg-[#F07E49] hover:text-white bg-white border border-gray-400 rounded-sm"
					>
						<a href="#" className="flex items-center p-[9px] ">
							<span className="mr-1 ">Narxi</span>
							<span>
								<AiOutlineDown />
							</span>
						</a>
					</div>
				</span>

				<span className="p-2 mr-3  w-[100px] rounded-sm ">
					<div
						onClick={onBed}
						className="hover:bg-[#F07E49] hover:text-white bg-white border border-gray-400 rounded-sm"
					>
						<a href="#" className="flex items-center p-[9px]">
							<span className="mr-1">Yotoq</span>
							<span>
								<AiOutlineDown />
							</span>
						</a>
					</div>
				</span>
				<span className="p-2 mr-3  w-[100px] rounded-sm ">
					<div
						onClick={onType}
						className="hover:bg-[#F07E49] hover:text-white bg-white border border-gray-400 rounded-sm"
					>
						<a href="#" className="flex items-center p-[9px]">
							<span className="mr-1">Turi</span>
							<span>
								<AiOutlineDown />
							</span>
						</a>
					</div>
				</span>

				{showModalPrice && (
					<div className=" bg-yellow-600 z-[1000]">
						<div className="relative">
							<div className="w-[300px]  bg-[#f07e49] absolute top-[31px] right-[140px]">
								<form
									// onSubmit={onMinMax}
									className="flex justify-between p-2 items-center"
								>
									<fieldset>
										<label>
											<input
												type="text"
												className="w-28"
												placeholder="Min $"
												// ref={firstInputRef}
												onKeyDown={handleMinPriceKeyDown}
												value={minPrice} onChange={onMinPriceChange}
											/>
										</label>
									</fieldset>
									<i className="text-white">
										<AiOutlineMinus />
									</i>
									<fieldset>
										<label>
											<input
												type="text"
												className="w-28"
												placeholder="Max $"
												ref={maxPriceRef}
												onKeyDown={handleMaxPriceKeyDown}
												value={maxPrice} onChange={onMaxPriceChange} 
											/>
										</label>
									</fieldset>
								</form>
								<button type="submit" style={{ display: "none" }}></button>
							</div>
						</div>
					</div>
				)}

				{showModalBed && (
					<div className=" bg-yellow-600 z-[1000]">
						<div className="relative">
							<div className="w-[300px]  bg-[#f07e49] absolute top-[31px] right-[25px]">
								<div className="flex justify-between p-2 items-center">
									<fieldset>
										<label>
											<input type="text" className="w-28" placeholder="Min" onKeyDown={handleMinBedKeydown} value={minBed} onChange={onMinBedChange} />
										</label>
									</fieldset>
									<i className="text-white">
										<AiOutlineMinus />
									</i>
									<fieldset>
										<label>
											<input type="text" className="w-28" placeholder="Max" 
											onKeyDown={handleMaxBedKeydown} ref={maxBedRef} value={maxBed} onChange={onMaxBedChange}/>
										</label>
									</fieldset>
								</div>
							</div>
						</div>
					</div>
				)}

				{showModalType && (
					<div className=" bg-yellow-600 z-[1000]">
						<div className="relative">
							<div className="w-[200px] h-[58px]  bg-[#f07e49] absolute top-[31px] right-[25px] flex items-center justify-evenly">
								<div className="flex justify-between p-1 items-center">
									<fieldset>
										<input
											type="checkbox"
											className="w-4"
											checked={isLeaseChecked}
											onChange={handleLeaseCheckboxChange}
											
										/>
										<label className="text-white ml-1">Ijara</label>
									</fieldset>
									<i className="text-white ml-2 mr-2">
										<AiOutlineMinus />
									</i>
									<fieldset>
										<input
											type="checkbox"
											className="w-4"
											checked={isSaleChecked}
											onChange={handleSaleCheckboxChange}
											
										/>
										<label className="text-white ml-1">Sotish</label>
									</fieldset>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

		/* </ListingContext.Provider> */
	);
}
