import axios from "axios";

interface EndpointOutput {
  success: boolean;
  data?: any;
}

export async function enableEndpointApi(
  endpointId: string,
  data: any
): Promise<EndpointOutput> {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/endpoints/${endpointId}`,
      data
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error };
  }
}
