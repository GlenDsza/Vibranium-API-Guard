import axios from "axios";

export interface TestsPerformed {
  _id: string;
  testName: string;
  testSuccess: boolean;
}

export interface TestObject {
  _id: string;
  endpoint: {
    _id: string;
    method: string;
    path: string;
  };
  testsPerformed: Array<TestsPerformed>;
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

export async function deleteTest(id: string): Promise<boolean> {
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/test/${id}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
