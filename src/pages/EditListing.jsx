import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
	const navigate = useNavigate();
	const auth = getAuth();
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [listing, setListing] = useState(null);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		description: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		latitude: 0,
		longitude: 0,
		images: {},
	});
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		address,
		furnished,
		description,
		offer,
		regularPrice,
		discountedPrice,
		latitude,
		longitude,
		images,
	} = formData;

	const params = useParams()

	useEffect(() => {
		if(listing && listing.userRef !== auth.currentUser.uid){
			toast.error("Siz bu ro'yxatni o'zgartira olmaysiz")
			navigate("/")
		}
	}, [auth.currentUser.uid, listing, navigate]);
	// yuqoridgai bizni edit listing page dagi urlni boshqa user ishlatayotgan joyga qoysa sen edit qila olmaysan degan yozuvv chiqadi if() ni ichidagi kod listing bor bolsa va listing ichidagi id bilan autentifikatsiya bolgan id bir xil bolmasa xatolik chiqarib beradi

	useEffect(() => {
		setLoading(true);
		async function fetchListing(){
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);
			if(docSnap.exists()){
				setListing(docSnap.data());
				setFormData({...docSnap.data()});
				setLoading(false);
			}else{
				navigate("/");
				toast.error("Mavjud emas");
			}
		}
		fetchListing();
	},	[navigate, params.listingId])

	function onChange(e) {
		let boolean = null;
		if (e.target.value === "true") {
			boolean = true;
		}
		if (e.target.value === "false") {
			boolean = false;
		}
		//Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}
		//Text, Boolean, Number
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value, // boolean qiymati null bo'lsa yoki qiymat boshqa turdagi bo'lsa, e.target.value qiymatni qaytaradi. Agar boolean qiymati true yoki false bo'lsa, true yoki false qaytaradi
			}));
		}
	}

	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		
		if (offer && +discountedPrice >= +regularPrice) {
			setLoading(false);
			toast.error("Chegirmadagi narx belgilangan narxdan kamroq bo'lishi kerak");
			return;
		}
		if (images.length > 6) {
			setLoading(false);
			toast.error("maximum 6 images are allowed");
			return;
		}
		let geolocation = {};
		if (geolocationEnabled) {
			try {
				const response = await fetch(
					`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_GEOCODE_API_KEY}&q=${address}&format=json`,
				);
				if (response.ok) {
					const data = await response.json();
					geolocation.lat = data[0].lat;
					geolocation.lon = data[0].lon;
				} else {
					geolocation.lat = latitude;
					geolocation.lng = longitude;
				}
			} catch (error) {
				setLoading(false);
				toast.error("To'g'ri manzil kiriting");
				return;
			}
		}

		async function storeImage(image) {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, filename);
				const uploadTask = uploadBytesResumable(storageRef, image);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					},
				);
			});
		}

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image)),
		).catch((error) => {
			setLoading(false);
			toast.error("Rasmlar yuklanmadi");
			return;
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
			userRef: auth.currentUser.uid,
		};
		delete formDataCopy.images;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;
		delete formDataCopy.latitude;
		delete formDataCopy.longitude;

		const docRef = doc(db, "listings", params.listingId)
		await updateDoc(docRef, formDataCopy);

		setLoading(false);
		toast.success("Ro'yxat o'zgartirildi");
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	}

	if (loading) {
		return <Spinner />;
	}

	return (
		<main className="max-w-md px-2 mx-auto">
			<h1 className="text-3xl text-center mt-6 font-bold">Ro'yxatni o'zgartirish</h1>
			<form onSubmit={onSubmit}>
				<p className="text-lg mt-6 font-semibold">Sotish / Ijaraga berish</p>
				<div className="flex">
					<button
						type="button"
						id="type"
						value="sale"
						onClick={onChange}
						className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "rent"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
					>
						sotish
					</button>
					<button
						type="button"
						id="type"
						value="rent"
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "sale"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
					>
						ijaraga berish
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Nomi</p>
				<input
					type="text"
					id="name"
					value={name}
					onChange={onChange}
					placeholder="..."
					maxLength="32"
					minLength="10"
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				<div className="flex space-x-6 mb-6">
					<div>
						<p className="text-lg font-semibold">Yotoq</p>
						<input
							type="number"
							id="bedrooms"
							value={bedrooms}
							onChange={onChange}
							min="1"
							max="50"
							required
							className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
						/>
					</div>
					<div>
						<p className="text-lg font-semibold">Vanna</p>
						<input
							type="number"
							id="bathrooms"
							value={bathrooms}
							onChange={onChange}
							min="1"
							max="50"
							required
							className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
						/>
					</div>
				</div>
				<p className="text-lg mt-6 font-semibold">Avto turargoh</p>
				<div className="flex">
					<button
						type="button"
						id="parking"
						value={true}
						onClick={onChange}
						className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							!parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						bor
					</button>
					<button
						type="button"
						id="parking"
						value={false}
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yo'q
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Jixozlangan</p>
				<div className="flex">
					<button
						type="button"
						id="furnished"
						value={true}
						onClick={onChange}
						className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							!furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						ha
					</button>
					<button
						type="button"
						id="furnished"
						value={false}
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yo'q
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Manzil</p>
				<textarea
					type="text"
					id="address"
					value={address}
					onChange={onChange}
					placeholder="..."
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				{!geolocationEnabled && (
					<div className="flex space-x-6 mb-6">
						<div className="">
							<p>Latitude</p>
							<input
								type="number"
								id="latitude"
								value={latitude}
								onChange={onChange}
								required
								min="-90"
								max="90"
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
							/>
						</div>
						<div className="">
							<p>Longitude</p>
							<input
								type="number"
								id="longitude"
								value={longitude}
								onChange={onChange}
								required
								min="-180"
								max="180"
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
							/>
						</div>
					</div>
				)}
				<p className="text-lg font-semibold">Uy haqida</p>
				<textarea
					type="text"
					id="description"
					value={description}
					onChange={onChange}
					placeholder=""
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				<p className="text-lg font-semibold">Chegirma</p>
				<div className="flex mb-6">
					<button
						type="button"
						id="offer"
						value={true}
						onClick={onChange}
						className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							!offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						bor
					</button>
					<button
						type="button"
						id="offer"
						value={false}
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yo'q
					</button>
				</div>
				<div className="flex items-center mb-6">
					<div className="">
						<p className="text-lg font-semibold">Narxi</p>
						<div className="flex w-full justify-center items-center space-x-6">
							<input
								type="number"
								id="regularPrice"
								value={regularPrice}
								onChange={onChange}
								min="50"
								max="400000000"
								required
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
							/>
							{type === "rent" && (
								<div className="">
									<p className="text-md w-full whitespace-nowrap">$ / OY</p>
								</div>
							)}
						</div>
					</div>
				</div>
				{offer && (
					<div className="flex items-center mb-6">
						<div className="">
							<p className="text-lg font-semibold">Chegirmadagi narx</p>
							<div className="flex w-full justify-center items-center space-x-6">
								<input
									type="number"
									id="discountedPrice"
									value={discountedPrice}
									onChange={onChange}
									min="50"
									max="400000000"
									required={offer}
									className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
								/>
								{type === "rent" && (
									<div className="">
										<p className="text-md w-full whitespace-nowrap">
											$ / OY
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="mb-6">
					<p className="text-lg font-semibold">Rasmlar</p>
					<p className="text-gray-600">
						Rasmlar soni (max 6)
					</p>
					<input
						type="file"
						id="images"
						onChange={onChange}
						accept=".jpg,.png,.jpeg"
						multiple
						required
						className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
					/>
				</div>
				<button
					type="submit"
					className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
				>
					Ro'yxatni o'zgartirish
				</button>
			</form>
		</main>
	);
}
