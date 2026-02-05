
app.get("/api/matches/stats", async (req, res) => {
  try {
    const { season } = req.query;
    let seasonFilter = "";
    const params = [];

    if (season) {
        seasonFilter = "WHERE m.season = $1";
        params.push(season);
    }

    const query = `
      SELECT 
        p.match_id,
        COUNT(*) as total_votes,
        COUNT(CASE WHEN p.home_score > p.away_score THEN 1 END) as home_votes,
        COUNT(CASE WHEN p.home_score < p.away_score THEN 1 END) as away_votes,
        COUNT(CASE WHEN p.home_score = p.away_score THEN 1 END) as draw_votes
      FROM predictions p
      JOIN matches m ON p.match_id = m.id
      ${seasonFilter}
      GROUP BY p.match_id
    `;

    const result = await pool.query(query, params);
    
    const stats = {};
    result.rows.forEach(row => {
        const total = parseInt(row.total_votes);
        if (total > 0) {
            stats[row.match_id] = {
                home_pct: Math.round((row.home_votes / total) * 100),
                away_pct: Math.round((row.away_votes / total) * 100),
                draw_pct: Math.round((row.draw_votes / total) * 100),
                total
            };
        }
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calculating stats" });
  }
});
