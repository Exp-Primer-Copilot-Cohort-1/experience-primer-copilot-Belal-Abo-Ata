function skillsMember() {
    return {
        name: 'John Doe',
        age: 30,
        skills: ['HTML', 'CSS', 'JS'],
        greet: function() {
            console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
        }
    };
}
