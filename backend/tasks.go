package main

import (
	"github.com/gofiber/fiber/v2"
)

func getTasks(c *fiber.Ctx) error {
	userId := c.Locals("user_id")

	var tasks []Task
	if result := db.Where("user_id = ?", userId).Find(&tasks); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch tasks",
		})
	}

	return c.JSON(tasks)
}

func createTask(c *fiber.Ctx) error {
	userId := c.Locals("user_id")

	var task Task
	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	task.UserID = userId.(uint)
	if result := db.Create(&task); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create task",
		})
	}

	return c.JSON(task)
}

func updateTask(c *fiber.Ctx) error {
	userId := c.Locals("user_id")
	taskId := c.Params("id")

	var task Task
	if result := db.Where("id = ? AND user_id = ?", taskId, userId).First(&task); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	db.Save(&task)
	return c.JSON(task)
}

func deleteTask(c *fiber.Ctx) error {
	userId := c.Locals("user_id")
	taskId := c.Params("id")

	var task Task
	if result := db.Where("id = ? AND user_id = ?", taskId, userId).First(&task); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	db.Delete(&task)
	return c.SendStatus(fiber.StatusNoContent)
}