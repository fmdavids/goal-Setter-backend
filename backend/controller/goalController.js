const asyncHandler = require("express-async-handler")
const Goal = require("../models/goalSchema")


//@desc Get goals
//@route GET /api/goals
//@access Privateto 
const getGoals = asyncHandler( async (req, res) => {

    const goals = await Goal.find()

    res.status(200).json(goals)
})

//@desc Set goal
//@route POST /api/goals
//@access Private
const setGoal = asyncHandler( async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add a text field")
    }

    const goal = await Goal.create({
        text: req.body.text
    })
    res.status(200).json(goal)
})

//@desc Update goal
//@route PUT /api/goals/:id
//@access Private
const updateGoal = asyncHandler( async (req, res) => {

    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error("Please, select which goal to update")
    }
    
    const updatedGoal = await Goal.findByIdAndUpdate(goal, req.body, {
        new: true
    })

    res.status(200).json(updatedGoal)
})

//@desc delete goal
//@route DELETE /api/goals/:id
//@access Private
const deleteGoal = asyncHandler( async (req, res) => {
        const removeGoal = await Goal.findById(req.params.id)

        if(!removeGoal) {
            res.status(400)
            throw new Error("Please, select which goal to DELETE")
        }

        const deletedGoal = await Goal.findByIdAndDelete(removeGoal)

    res.status(200).json(deletedGoal)
})

module.exports = {getGoals, setGoal, updateGoal, deleteGoal}