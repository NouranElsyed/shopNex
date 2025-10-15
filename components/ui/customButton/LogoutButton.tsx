

import {useRouter} from "next/navigation";
import { AnimatedButton } from "./MotionButton";
import { useUserStore } from "@/store/user.store";

const LogoutButton = () => {
  const {clearUser} = useUserStore()
  const router = useRouter()
  const handleLogout = async() => {
    console.log("logout")
    try {
        
        await fetch('/api/logout',{
            method: 'POST',
        }) 
        clearUser()
        router.push("/login");
    } catch (error) {
        console.log(error)
    }
  }
  return <AnimatedButton onClick={handleLogout}  className="bg-red-600 hover:bg-red-700 font-semibold">Logout</AnimatedButton>;
};

export default LogoutButton;
