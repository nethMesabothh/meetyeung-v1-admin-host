import { Breadcrumbs } from "../breadcrumbs";
import { AppSidebar } from "../sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="p-[13.5px] w-full border-b flex items-center gap-4">
					<SidebarTrigger className="mt-[3px]" />
				</div>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
};
