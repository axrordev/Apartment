import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
import SearchedPlace from "./pages/SearchedPlace";

function App() {
	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/profile" element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/forget-password" element={<ForgotPassword />} />
					<Route path="/offers" element={<Offers />} />
					<Route path="/category/:categoryName" element={<Category />} />
					<Route pathe="/create-listing" element={<PrivateRoute />}>
						<Route path="/create-listing" element={<CreateListing />} />
					</Route>
					<Route pathe="/edit-listing" element={<PrivateRoute />}>
						<Route path="/edit-listing/:listingId" element={<EditListing />} />
					</Route>
					<Route
						path="/category/:categoryName/:listingId"
						element={<Listing />}
					/>
					<Route path="/searched-place" element={<SearchedPlace/>} />

				</Routes>
			</Router>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</>
	);
}
export default App;
