interface Testimonial {
  testimony: string;
  user: {
    name: string;
    role: string;
    logo: string;
  };
  date: Date;
}

// TODO: Populate with real user testimonials once gathered.
export const Testimonials: Testimonial[] = [];
