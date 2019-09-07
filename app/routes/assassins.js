const express = require('express');

const router = express.Router();

class Team {
    constructor(players, id, assassinated, assassinated_type = "full") {
        this.players = players;
        this.id = id;
        this.assassinated = assassinated;
        this.assassinated_type = assassinated_type;
    }
}
class Group {
    constructor(teamId, targetIds) {
        this.teamId = teamId;
        this.targetIds = targetIds;
    }
}


router.get('/', async(req, res) => {
    let teams = [
        new Team(['Aidan', 'Ty'], 1, true, "full"),
        new Team(['Kadie', 'Deni'], 2, true, "left"),
        new Team(['Cale', 'Trey'], 3, false),
        new Team(['Dylan', 'Austin'], 4, false), "right",
        new Team(['Katy', 'Uma'], 5, false),
        new Team(['Jaida', 'Colette'], 6, false),
        new Team(['Colton', 'Courtney'], 7, false),
    ];

    let groups = [
        new Group(1, [2]),
        new Group(2, [3]),
        new Group(3, [4]),
        new Group(4, [5]),
        new Group(5, [6]),
        new Group(6, [7]),
        new Group(7, [1]),
    ];
    res.render('assassins', {
        groups,
        teams,
        findTeamById: (teams, id) => {
            for (var i = 0; i < teams.length; i++) {
                if (teams[i].id === id) return teams[i];
            }
            return new Team(['NULL', 'NULL'], -1);
        },
    });
});

router.post('/', async(req, res) => {});

router.put('/', async(req, res) => {});

router.delete('/', async(req, res) => {});

module.exports = router;