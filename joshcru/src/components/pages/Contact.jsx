import React from 'react';

const Contact = () => (
  <div className="contact">
    <h2>Contact Me</h2>
    <form className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Your Name" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="your.email@example.com" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={5} placeholder="How can I help you?"></textarea>
      </div>
      <button type="submit" className="submit-button">Send Message</button>
    </form>
    
    <div className="contact-info">
      <p>Email: joshcruzado2003@gmail.com</p>
      <p>LinkedIn: <a href="https://linkedin.com/in/joshua-cruzado" target="_blank" rel="noopener noreferrer">linkedin.com/in/joshua-cruzado</a></p>
      <p>GitHub: <a href="https://github.com/joshcru" target="_blank" rel="noopener noreferrer">github.com/joshcru</a></p>
    </div>
  </div>
);

export default Contact;