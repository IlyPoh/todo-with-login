import { IFilterOptions } from '../types';

export const complitionFilterOptions: IFilterOptions[] = [
  { text: 'All todos', value: 'allComplitions' },
  { text: 'Completed', value: 'completed' },
  { text: 'Uncompleted', value: 'uncompleted' },
  { text: 'Favorites', value: 'favourites' },
];

export const userFilterOptions = (
  userId: string | undefined
): IFilterOptions[] => {
  userId = userId ? userId : '';
  return [
    { text: 'All Users', value: 'allUsers' },
    { text: userId, value: userId },
  ];
};
