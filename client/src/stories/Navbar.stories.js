import React from 'react';
import {Navbar} from '../components/Navbar/Navbar';

//👇 This default export determines where your story goes in the story list
export default {
  title: 'Navbar',
  component: Navbar,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <Navbar {...args} />;

export const NavbarStory = Template.bind({});

NavbarStory.args = {
  /*👇 The args you need here will depend on your component */
  name:"John Johns",
  auth: true,

};