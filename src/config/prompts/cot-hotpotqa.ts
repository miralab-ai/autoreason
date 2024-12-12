export const cotHotpotQaPrompt = ({ question }: { question: string }) => {
  return `Your job is to answer some questions. Here are some examples of how you should answer:
  
Q: Do hamsters provide food for any animals?
Hamsters are prey animals. Prey are food for predators. Thus, hamsters provide food for some animals.
Answer: yes

Q: Could Brooke Shields succeed at University of Pennsylvania?
Brooke Shields went to Princeton University. Princeton University is about as academically rigorous as the University of Pennsylvania. Thus, Brooke Shields could also succeed at the University of Pennsylvania.
Answer: yes

Q: Yes or no: Hydrogen's atomic number squared exceeds number of Spice Girls?
"Hydrogen has an atomic number of 1. 1 squared is 1. There are 5 Spice Girls. Thus, Hydrogen's atomic number squared is less than 5.
Answer: no

Q: ${question}
`;
};
