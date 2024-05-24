import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './Firebase';

 export const useUserstore = create((set) => ({
  currentUser: null,
  isLoading: true,
fetchUserInfo: async (uid) => {
    if(!uid) return set({currentUser:null, isLoading:false})

        try{

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

            //   console.log("Document data:", docSnap.data());
            set({currentUser: docSnap.data(), isLoading: false})
            } else{
                set({currentUser: null, isLoading: false})

            }

        }catch(err){
            console.log(err);
            return set({currentUser:null, isLoading:false})

        }
}

//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
}))