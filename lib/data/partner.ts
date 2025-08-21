import { IPartnerResponse } from "../types/partners";

export const mockPartners: IPartnerResponse[] = [
	{
		id: "partner-uuid-1",
		order: 0,
		createdAt: new Date("2025-08-20T10:00:00Z"),
		updatedAt: new Date("2025-08-20T10:00:00Z"),
		isActive: false,
		media: {
			id: "media-uuid-a",
			url: "https://play-lh.googleusercontent.com/-deHHbwBUh2I4dzTjq9n4ggBGPqJwKzj9pwvPqyaR-hPxzKN9QVJOBsZP_ShlCDmX60",
			altText: "WingBank",
		},
	},
	{
		id: "partner-uuid-4",
		order: 3,
		createdAt: new Date("2025-08-17T09:00:00Z"),
		updatedAt: new Date("2025-08-17T09:00:00Z"),
		isActive: false,
		media: {
			id: "media-uuid-d",
			url: "https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/305564292_649477980078015_4926982680244348577_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=j97HdfFn14kQ7kNvwG_pID7&_nc_oc=AdmJAoLibdmPXe2hHx8NbR1Octqx4aJxc38uYxKSA1wuUGTzNHdyV2u9XbQc_qiFMjU&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=hc6RnbVA-9Hd2l5GJ4u28A&oh=00_AfU5mFEEFtut4jS1DiJqvJPz3EXlIWNQ-Ub-sIanet0DrA&oe=68AC5DAE",
			altText: "My Cut",
		},
	},
];
