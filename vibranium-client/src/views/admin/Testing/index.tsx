import { useState } from "react";
import TestTable from "./components/TestTable";
import { TestObject } from "@/apis/tests";
import SingleTestDrawer from "./components/SingleTestDrawer";

const Endpoints = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [singleTest, setSingleTest] = useState<TestObject | null>(null);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSingleTest(null);
  };

  const openDrawer = (singleTest: TestObject) => {
    setSingleTest(singleTest);
    setDrawerOpen(true);
  };

  return (
    <div>
      <div className="mx-3 my-3 grid grid-cols-1">
        <TestTable openDrawer={openDrawer} />
      </div>
      {drawerOpen && singleTest !== null && (
        <SingleTestDrawer
          open={drawerOpen}
          hide={closeDrawer}
          singleTest={singleTest}
        />
      )}
    </div>
  );
};

export default Endpoints;
