import axios from "axios";

interface BlacklistOutput {
  success: boolean;
  data?: any;
}

export async function maybeBlockIp(
  orgId: string,
  ip: string,
  block: boolean = true
): Promise<BlacklistOutput> {
  try {
    const res = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/organizations/${orgId}/blockedips`,
      {
        ip,
        block,
      }
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error };
  }
}

export async function getBlacklistedIps(
  orgId: string
): Promise<BlacklistOutput> {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/organizations/${orgId}/blockedips`
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error };
  }
}
