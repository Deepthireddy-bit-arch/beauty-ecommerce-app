import { fetchHomeDataApi } from "../../../api/homeApi";
import {
  setLoading,
  setCategories,
  setError,
  setInsiderBuzz,
} from "../../slices/homeSlice";

export const fetchHomeData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await fetchHomeDataApi();

    dispatch(setCategories(response.data.categories));
    dispatch(setInsiderBuzz(response.data.insiderBuzz));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};