// Volunteer Model
class Volunteer {
  constructor(id, name, email, phone, role, organization, skills, availability) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role; // 'volunteer' or 'admin'
    this.organization = organization;
    this.skills = skills; // array of skills
    this.availability = availability; // array of days/times
    this.createdAt = new Date();
  }
}

module.exports = Volunteer;
