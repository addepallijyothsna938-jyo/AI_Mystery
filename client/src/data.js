export const sampleCase = {
  caseId: 'CASE-0482',
  title: 'The Last Light at Bellwether',
  summary: 'A lighthouse goes dark at 11:47 PM. By morning, the keeper is gone—and a century-old signal lens has vanished.',
  setting: 'Bellwether Point · North Atlantic',
  incident: { type: 'Missing person / artifact', description: 'Keeper Elias Ward vanished during a storm. The Fresnel lens was removed from a locked lantern room.', occurredAt: '2026-10-18T23:47:00' },
  genre: 'Missing Artifact', difficulty: 'Medium', status: 'active', progress: 42,
  suspects: [
    { suspectId: 'S-01', name: 'Mara Voss', age: 34, occupation: 'Marine salvage diver', relationshipToIncident: 'Hired to survey the reef', background: 'Knows the tidal caves below Bellwether better than anyone. Recently returned after seven years away.', motive: 'Her family once owned the lens—and the property deed may still be contested.', publicAlibi: 'Says she was at the harbor café when the light failed.', initials: 'MV', color: 'sea' },
    { suspectId: 'S-02', name: 'Jonah Pike', age: 51, occupation: 'Assistant keeper', relationshipToIncident: 'Worked the lighthouse with Elias', background: 'A quiet fixture on the island. Kept meticulous logbooks until the final week.', motive: 'Elias planned to report irregularities in Jonah’s maintenance records.', publicAlibi: 'Claims he was asleep in the east cottage.', initials: 'JP', color: 'rust' },
    { suspectId: 'S-03', name: 'Dr. Celia Wren', age: 42, occupation: 'Maritime historian', relationshipToIncident: 'Documented the lens restoration', background: 'Leading authority on nineteenth-century coastal optics. Her grant ends this winter.', motive: 'A private collector offered a fortune for an unrecorded original lens.', publicAlibi: 'Her field recorder places her at the cliff path.', initials: 'CW', color: 'sage' },
    { suspectId: 'S-04', name: 'Theo Bell', age: 28, occupation: 'Supply boat captain', relationshipToIncident: 'Delivered provisions that evening', background: 'Knows every landing and weather window along the coast.', motive: 'Owes money to a mainland lender; an anonymous payment arrived last month.', publicAlibi: 'Says he left the island before the storm.', initials: 'TB', color: 'gold' }
  ],
  timeline: [
    { time: '21:12', description: 'Supply boat docks at the lower quay', suspect: 'Theo Bell' },
    { time: '22:06', description: 'Last radio check from the lantern room', suspect: 'Elias Ward' },
    { time: '22:31', description: 'Storm surge closes the eastern footpath', suspect: 'All personnel' },
    { time: '23:47', description: 'Bellwether light goes dark', suspect: 'Unknown' },
    { time: '00:18', description: 'Emergency flare seen from the mainland', suspect: 'Unknown' }
  ],
  evidence: [
    { evidenceId: 'EV-01', title: 'The keeper’s log', type: 'document', description: 'A page torn from the station log, recovered beneath the chart table.', content: 'October 18 — J.P. asked again about the eastern stair. Told him the ironwork is not safe. He said it would only need to hold for a minute. I do not like the way he looks at the light.', relatedSuspectIds: ['S-02'], clueIds: ['C-01'], found: true, time: '22:41', icon: 'file' },
    { evidenceId: 'EV-02', title: 'Last transmission', type: 'audio', description: 'Transcript recovered from the harbor radio receiver.', content: '22:06 — WARD: “Pike, the lamp is still running hot. We should shut it down.”\n22:07 — PIKE: [unintelligible]\n22:08 — WARD: “You said the east stair was repaired.”\n22:09 — [carrier loss]', relatedSuspectIds: ['S-02'], clueIds: ['C-02'], found: true, time: '22:06', icon: 'audio' },
    { evidenceId: 'EV-03', title: 'Mud on the landing', type: 'physical', description: 'A cast of boot impressions beneath the eastern exterior stair.', content: 'One set of narrow work boots leads toward the sea cave. The tread has a distinctive diagonal patch on the left heel. A maintenance inventory lists only one pair with that repair.', relatedSuspectIds: ['S-02'], clueIds: ['C-03'], found: true, time: '00:32', icon: 'scan' },
    { evidenceId: 'EV-04', title: 'Café receipt', type: 'document', description: 'A water-damaged receipt from the harbor café.', content: 'Two cups of black coffee. 23:19. Initialled “M.V.” The harbor camera clock runs eleven minutes fast; the café is closed by 22:30.', relatedSuspectIds: ['S-01'], clueIds: ['C-04'], found: true, time: '23:19', icon: 'file' },
    { evidenceId: 'EV-05', title: 'A room with no light', type: 'image', description: 'Simulated evidence illustration · lantern room after the storm.', content: 'The lens mount is undamaged. Salt traces on the inner rail suggest the lens was lowered through the maintenance hatch, not carried down the tower stairs.', relatedSuspectIds: ['S-02', 'S-03'], clueIds: ['C-05'], found: false, time: '00:51', icon: 'image' },
    { evidenceId: 'EV-06', title: 'The collector’s note', type: 'message', description: 'A fictional letter found folded inside the archive catalogue.', content: '“The lens is worth more intact than the entire station. I can arrange collection once the restoration is complete. No questions about provenance.” — A. Vale', relatedSuspectIds: ['S-03'], clueIds: ['C-06'], found: false, time: 'Oct 12', icon: 'message' }
  ],
  solution: { culpritSuspectId: 'S-02', motive: 'Jonah feared Elias would expose falsified maintenance reports and had access to the eastern stair and hatch.', method: 'Jonah used the repaired boot on the eastern stair to lower the lens through the maintenance hatch and escape through the sea cave during the storm.', explanation: 'The radio transcript puts Jonah in a dispute with Elias about the unsafe stair shortly before the blackout. The keeper’s log records Jonah asking about the stair, and the boot impression matches the repaired pair assigned to him. Salt traces show the lens left through the hatch, a route only the assistant keeper knew was accessible. The café receipt and collector’s note point toward Mara and Celia, but their clues do not place either at the hatch.', evidenceIds: ['EV-01', 'EV-02', 'EV-03', 'EV-05'], clueIds: ['C-01', 'C-02', 'C-03', 'C-05'] }
};

export const stories = [
  { number: '01', category: 'MISSING ARTIFACT', title: 'The Last Light at Bellwether', location: 'North Atlantic · 4 suspects', date: '18 OCT 2026', status: 'In progress', progress: 42, image: 'sea' },
  { number: '02', category: 'CLOSED ROOM', title: 'A Silence in Room 204', location: 'The Halcyon Hotel · 5 suspects', date: '12 OCT 2026', status: 'Case closed', progress: 100, image: 'hotel' },
  { number: '03', category: 'CYBER MYSTERY', title: 'Ghost in the Archive', location: 'Meridian Observatory · 3 suspects', date: '04 OCT 2026', status: 'Case closed', progress: 100, image: 'archive' }
];
