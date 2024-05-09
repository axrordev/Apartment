import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
//updateProfile - bu user name
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const [showPassword, setShowPassword] = useState("false");
  const navigate = useNavigate()
  function onchangeInput(e) {
    e.preventDefault();
    console.log(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onsubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      updateProfile(auth.currentUser, {
        displayName: name 
      })
      const user = userCredential.user;
      const formDataCopy = {...formData}
      delete formDataCopy.password                // parol ochirvorish un
      formDataCopy.timestamp = serverTimestamp()  // vaqt ni korsatish un
      await setDoc(doc(db, "users", user.uid), formDataCopy)
      //Firebase Firestore ma'lumotlar bazasida ma'lumot yozish uchun ishlatiladi.
      navigate("/")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Ro'yxatdan o'tish</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a2V5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            alt="img"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onsubmit}>
            <input
              type="text"
              value={name}
              id="name"
              onChange={onchangeInput}
              className="mb-6 w-[100%] px-4 py-2 text-xl text-gray-700 border-gray-300 rounded transition ease-in-out "
              placeholder="Full Name"
            />
            <input
              type="email"
              value={email}
              id="email"
              onChange={onchangeInput}
              className="mb-6 w-[100%] px-4 py-2 text-xl text-gray-700 border-gray-300 rounded transition ease-in-out "
              placeholder="Email Address"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "password" : "text"}
                value={password}
                id="password"
                onChange={onchangeInput}
                className="w-[100%] px-4 py-2 text-xl text-gray-700 border-gray-300 rounded transition ease-in-out "
                placeholder="Password"
              />
              {showPassword ? (
								<AiFillEye
								className="absolute right-3 top-3 text-xl cursor-pointer"
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
								
                
              ) : (
                <AiFillEyeInvisible
								className="absolute right-3 top-3 text-xl cursor-pointer"
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
              )}
            </div>
            <div className="flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg">
              <p>
                Hisobingiz bormi?
                <Link
                  to="/sign-in"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1 "
                >
                  Kirish
                </Link>
              </p>
              <p>
                <Link
                  to="/forget-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Parol unutilgan
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Ro'yxatdan o'tish
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-4">yoki</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
