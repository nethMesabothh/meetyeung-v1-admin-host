import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export const BannerEmptyState = () => (
	<Card className="rounded-xl mt-4 border-2 border-dashed">
		<CardContent className="flex flex-col items-center justify-center py-20 text-center">
			<Upload className="h-12 w-12 text-muted-foreground mb-4" />
			<h3 className="text-lg font-medium mb-2">No Banners Yet</h3>
			<p className="text-muted-foreground mb-4 max-w-xs">
				Click "Add Banner" to upload your first one.
			</p>
		</CardContent>
	</Card>
);
