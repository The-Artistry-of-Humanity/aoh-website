// People with an email signature page at /signature/<slug>/. Each photo tile is
// in public/signature/ (made by tools/signature/make-assets.mjs in the nørma
// website repo). Business contact details only, as they appear on every email
// these people send.
export interface Person {
  slug: string;
  name: string;
  /** First name, for the signature's name in Gmail. */
  first: string;
  /** Title lines, shown in small capitals under the name. */
  role: string[];
  phone: string;
  tel: string;
  email: string;
  linkedin?: string;
  photo: string;
}

export const PEOPLE: Person[] = [
  {
    slug: 'ian', name: 'Ian Williams', first: 'Ian',
    role: ['Founder & CEO, The Artistry of Humanity'],
    phone: '+61 478 686 130', tel: '+61478686130', email: 'ian@artistry-of-humanity.com',
    linkedin: 'https://www.linkedin.com/in/ian-williams077/', photo: 'ian-williams.png',
  },
  {
    slug: 'sophia', name: 'Sophia Apostolou', first: 'Sophia',
    role: ['Strategy Client Partner | Facilitator', 'The Artistry of Humanity'],
    phone: '+61 422 339 063', tel: '+61422339063', email: 'sophia@artistry-of-humanity.com',
    linkedin: 'https://www.linkedin.com/in/sophia-apostolou-57756350/', photo: 'sophia-apostolou.png',
  },
  {
    slug: 'kevin', name: 'Kevin Wilder', first: 'Kevin',
    role: ['Head of US, The Artistry of Humanity'],
    phone: '+1 401-465-2317', tel: '+14014652317', email: 'kevin@artistry-of-humanity.com',
    linkedin: 'https://www.linkedin.com/in/kevinwilder/', photo: 'kevin-wilder.png',
  },
];
