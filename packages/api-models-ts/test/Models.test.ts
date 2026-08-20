import * as v from "valibot";

import { Groups, Photometry, Sources, Streams, Telescopes } from "skyportal-js-models";
import { describe, expect, it } from "vitest";

describe("strict models", () => {
    it("rejects a field the models do not know about", () => {
        const result = v.safeParse(Streams.Stream, { id: 1, name: "ztf", surprise: true });
        expect(result.success).toBe(false);
    });

    it("accepts a payload carrying only the required fields", () => {
        expect(v.parse(Streams.Stream, { id: 1, name: "ztf" })).toEqual({ id: 1, name: "ztf" });
    });

    it("defaults list-valued fields to empty rather than undefined", () => {
        const source = v.parse(Sources.Source, { id: "ZTF20abcdef" });
        expect(source.groups).toEqual([]);
        expect(source.photometry).toEqual([]);
        expect(source.duplicates).toEqual([]);
    });

    it("accepts the null a nullable column comes back as", () => {
        const telescope = v.parse(Telescopes.Telescope, { id: 1, name: "Palomar 1.5m", lat: null, robotic: null });
        expect(telescope.lat).toBeNull();
    });

    it("decodes the mutually recursive group / group-user pair", () => {
        const group = v.parse(Groups.Group, {
            id: 1,
            name: "Program A",
            group_users: [{ id: 5, user_id: 3, group: { id: 1, name: "Program A" } }],
        });
        expect(group.group_users?.[0]?.group?.name).toBe("Program A");
    });

    it("decodes a photometry point in magnitude space", () => {
        const point = v.parse(Photometry.PhotometryPoint, {
            id: 1,
            obj_id: "ZTF20abcdef",
            mjd: 59000.5,
            filter: "ztfg",
            mag: 19.2,
            magerr: 0.1,
            limiting_mag: 20.5,
            magsys: "ab",
        });
        expect(point.mag).toBe(19.2);
        expect(point.annotations).toEqual([]);
    });
});
