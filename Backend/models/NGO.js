// NGO Model
class NGO {
  constructor(id, name, category, description, email, phone, location, volunteers) {
    this.id = id;
    this.name = name;
    this.category = category; // Education, Healthcare, Environment, etc.
    this.description = description;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.volunteers = volunteers || 0;
    this.createdAt = new Date();
  }
}

module.exports = NGO;
