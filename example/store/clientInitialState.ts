import { Client } from "./Client";

export interface ClientState {
  name: string;
  client: Client;
  count: number;
  processing?: boolean;
  saving?: boolean;
  message: string;
  processingCreate?: boolean
  loading?: boolean;
  error?: string,
  csrfToken: string,
}

const clientInitialState = {
  saving: false,
  message: '',
  count: 1,
  csrfToken: '',
  hydrated: false,
  processing: false,
  processingCreate: false,
  isCreatorRole: false,
  client: {
    id: '',
    name: '',
    lastname: '',
    email: '',
    phone: 0,
    address: '',
    active: false,
  },
  error: '',
};

export default clientInitialState;
