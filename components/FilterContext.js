import React, { useState } from 'react'

export const FilterContext = React.createContext({
    state: {},
    setState: () => {}
})

export const FilterContextProvider = (props) => {
    const initState = {
        size: [],
        etat: [],
        category: [],
        search: "",
        page: 0
     }
  const [state, setState] = useState({
      state: initState,
      setState: obj => {
          setState({ ...state, state: obj })
      }
  })

  return (
    <FilterContext.Provider value={state}>
      {props.children}
    </FilterContext.Provider>
  )
}