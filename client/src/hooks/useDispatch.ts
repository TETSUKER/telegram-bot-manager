import { useDispatch } from "react-redux";
import { AppDispatch } from 'store/interfaces';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
