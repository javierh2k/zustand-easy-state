import React, { useEffect } from "react";
import { useClientStore } from "./store/useClientStore";
import type { Client } from "./store/Client";

const AppClients = () => {
  const {
    client,
    count,
    actions: { saveClient, counter },
  } = useClientStore();

  useEffect(() => {
    const newClient: Client = {
      id: 1,
      name: "John",
      lastname: "Doe",
      email: "doe@mail.com",
      phone: 123123,
      address: "",
      active: true,
    };
    saveClient(newClient);
  }, []);

  return (
    <>
      <h1>Tienda:</h1>
      <h3>
        Cliente: {client.name} {client.lastname}
      </h3>
      count: {count}
      <button onClick={counter}>counter +1</button>
    </>
  );
};

export default AppClients;
