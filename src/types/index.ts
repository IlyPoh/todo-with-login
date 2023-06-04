export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  classes?: string;
}

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: number | string;
    geo: {
      lat: number | string;
      lng: number | string;
    };
  };
  phone: number | string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface IFilters {
  complitionFilter: string;
  userFilter: string;
}

export interface IInputs {
  addValue: string;
  searchValue: string;
}

export interface IFilterOptions {
  text: string;
  value: string;
}
