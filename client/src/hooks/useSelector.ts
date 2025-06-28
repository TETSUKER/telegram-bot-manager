import { useSelector } from "react-redux";
import { RootState } from 'store/interfaces';

export const useAppSelector = useSelector.withTypes<RootState>();
