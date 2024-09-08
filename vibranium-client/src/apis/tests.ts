import axios from "axios";

interface TestObject {
  _id: string;
  endpoint: {
    _id: string;
    method: string;
    path: string;
  };
  testsPerformed: number;
  testsPassed: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type TestOutput =
  | {
      success: false;
    }
  | {
      success: true;
      data: TestObject[];
    };

export async function getTests(): Promise<TestOutput> {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/test`);
    return { success: true, data: res.data.tests };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
