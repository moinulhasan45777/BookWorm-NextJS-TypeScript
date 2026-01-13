import { UserType } from "./userType";

export interface AuthContextType {
  userData: UserType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  refetch: () => void;
}
