// Task Model
class Task {
  constructor(id, title, description, ngoId, volunteers, deadline, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ngoId = ngoId;
    this.volunteers = volunteers || [];
    this.deadline = deadline;
    this.status = status || 'open'; // open, in-progress, completed
    this.createdAt = new Date();
  }
}

module.exports = Task;
