import { addGroup } from '../../options/store'

type AddGroupParam = Parameters<typeof addGroup>['0']

export const useWillSaveGroup = () => {
  const groupRef = {
    value: [] as AddGroupParam[]
  }
  const addWillSaveGroup = (group: AddGroupParam | AddGroupParam[]) => {
    groupRef.value = groupRef.value.concat(group)
  }

  return {
    willSaveGroupRef: groupRef,
    addWillSaveGroup,
  }
}
