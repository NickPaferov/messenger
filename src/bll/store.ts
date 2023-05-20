import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { loadState, saveState } from '../utils/localStorage-util';
import { MessengerActionsType, MessengerReducer } from './messenger-reducer';

const rootReducer = combineReducers({ messenger: MessengerReducer });

export const store = createStore(rootReducer, loadState(), applyMiddleware(thunkMiddleware));

export type AppRootStateType = ReturnType<typeof rootReducer>;

type AppRootActionsType = MessengerActionsType;

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>;

type DispatchType = ThunkDispatch<AppRootStateType, unknown, AppRootActionsType>;

export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

store.subscribe(() => {
  saveState({
    messenger: store.getState().messenger,
  });
});

//@ts-ignore
window.store = store;
