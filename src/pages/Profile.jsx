import { getAuth, updateProfile } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";

export default function Profile() {
	const auth = getAuth();
	const navigate = useNavigate();
	const [changeDetail, setChangeDetail] = useState(false);
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const { name, email } = formData;
	function onLogout() {
		auth.signOut();
		navigate("/");
	}
	function onChange(e) {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	}
	async function onSubmit() {
		try {
			if (auth.currentUser.displayName !== name) {
				//update display name in firebase auth
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
				// update name in the firestore
				const docRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(docRef, {
					name,
				});
			}
			toast.success("Muvaffaqiyatli o'zgartirildi");
		} catch (error) {
			toast.error("Profil ma'lumotlar yangilab bo‘lmadi");
		}
	}
	useEffect(() => {
		async function fetchUserListings() {
			const listingRef = collection(db, "listings");
			 //listingRef o'zgaruvchisi, Firebase Firestore'da "listing" nomli biror koleksiyonga ma'lumot qo'shish, o'qish, yangilash, o'chirish va boshqarish uchun ishlatiladi.
			const q = query(
				listingRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc"),
			);//// bu query bizga malumotlarni oqish filtrlash tartiblash ... un kerak
			const querySnap = await getDocs(q);
			let listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listings);
			setLoading(false);
		}
		fetchUserListings();
	}, [auth.currentUser.uid]);

	async function onDelete(listingID) {
		if(window.confirm("O'chirishga ishonchingiz komilmi")){
			await deleteDoc(doc(db, "listings", listingID));
			const updatedListings = listings.filter((listing) => listing.id !== listingID);
			setListings(updatedListings)
			toast.success("muvaffaqqiatli o'chirildi ")
		}
	}
	function onEdit(listingID) {
		navigate(`/edit-listing/${listingID}`)
	}
	return (
		<>
			<section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
				<h1 className="text-3xl text-center mt-6 font-bold">Shaxsiy profil</h1>
				<div className="w-full md:w-[50%] mt-6 px-3">
					<form>
						{/* Name Input */}
						<input
							type="text"
							id="name"
							value={name}
							disabled={!changeDetail}
							onChange={onChange}
							className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
								changeDetail && "bg-red-200 focus:bg-red-200"
							}`}
						/>
						{/* Email Input */}
						<input
							type="email"
							id="email"
							value={email}
							disabled
							className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
						/>
						<div className="flex flex-wrap  justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
							<p className="flex items-center ">
								Ismingizni o'zgartirish
								<span
									onClick={() => {
										changeDetail && onSubmit();
										setChangeDetail((prevState) => !prevState);
									}}
									className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
								>
									{changeDetail ? "O'zgarishni saqlash" : "O'zgartirish"}
								</span>
							</p>
							<p
								onClick={onLogout}
								className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer ml-1"
							>
								Chiqish
							</p>
						</div>
					</form>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
					>
						<Link
							to="/create-listing"
							className="flex justify-center items-center"
						>
							<FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
							Sotish va Sotib olish 
						</Link>
					</button>
				</div>
			</section>
			<div className="max-w-6xl px-3 mt-6 mx-auto">
				{!loading && listings.length > 0 && (
					<>
						<h2 className="text-2xl text-center font-semibold mb-6">
              Mening ro'yxatlarim
            </h2>
						<ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing.data}
									onDelete={()=> onDelete(listing.id)}
									onEdit={()=> onEdit(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</div>
		</>
	);
}
