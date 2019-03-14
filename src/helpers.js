import mongoose from 'mongoose'

export const clearDatabase = () => {
  return new Promise((resolve) => {
    let count = 0
    let max = Object.keys(mongoose.connection.collections).length
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].deleteOne(() => {
        count++
        if (count >= max) {
          resolve()
        }
      })
    }
  })
}
