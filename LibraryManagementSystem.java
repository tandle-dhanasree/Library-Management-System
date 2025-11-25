import java.util.InputMismatchException;
import java.util.Scanner;

public class LibraryManagementSystem {

    public static void main(String[] args) {
        LibraryService libraryService = new LibraryService();
        Scanner scanner = new Scanner(System.in);

        int choice = -1;

        while (choice != 0) {
            printMainMenu();
            try {
                System.out.print("Enter your choice: ");
                choice = scanner.nextInt();
                scanner.nextLine(); // consume newline

                switch (choice) {
                    case 1:
                        handleAddBook(scanner, libraryService);
                        break;
                    case 2:
                        libraryService.listAllBooks();
                        break;
                    case 3:
                        handleSearchBooks(scanner, libraryService);
                        break;
                    case 4:
                        handleAddMember(scanner, libraryService);
                        break;
                    case 5:
                        libraryService.listAllMembers();
                        break;
                    case 6:
                        handleIssueBook(scanner, libraryService);
                        break;
                    case 7:
                        handleReturnBook(scanner, libraryService);
                        break;
                    case 8:
                        libraryService.listAllLoans();
                        break;
                    case 9:
                        libraryService.listActiveLoans();
                        break;
                    case 0:
                        System.out.println("Exiting... Thank you!");
                        break;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }

            } catch (InputMismatchException e) {
                System.out.println("Please enter a valid number.");
                scanner.nextLine(); // clear invalid input
            }
            System.out.println();
        }

        scanner.close();
    }

    private static void printMainMenu() {
        System.out.println("======================================");
        System.out.println("       LIBRARY MANAGEMENT SYSTEM      ");
        System.out.println("======================================");
        System.out.println("1. Add Book");
        System.out.println("2. List All Books");
        System.out.println("3. Search Books");
        System.out.println("4. Add Member");
        System.out.println("5. List All Members");
        System.out.println("6. Issue Book");
        System.out.println("7. Return Book");
        System.out.println("8. List All Loans");
        System.out.println("9. List Active Loans");
        System.out.println("0. Exit");
        System.out.println("======================================");
    }

    private static void handleAddBook(Scanner scanner, LibraryService service) {
        System.out.print("Enter book title: ");
        String title = scanner.nextLine();

        System.out.print("Enter book author: ");
        String author = scanner.nextLine();

        System.out.print("Enter book category: ");
        String category = scanner.nextLine();

        service.addBook(title, author, category);
    }

    private static void handleSearchBooks(Scanner scanner, LibraryService service) {
        System.out.println("1. Search by title");
        System.out.println("2. Search by author");
        System.out.print("Enter choice: ");
        int ch = scanner.nextInt();
        scanner.nextLine(); // consume newline

        switch (ch) {
            case 1:
                System.out.print("Enter title keyword: ");
                String titleKeyword = scanner.nextLine();
                service.searchBooksByTitle(titleKeyword);
                break;
            case 2:
                System.out.print("Enter author keyword: ");
                String authorKeyword = scanner.nextLine();
                service.searchBooksByAuthor(authorKeyword);
                break;
            default:
                System.out.println("Invalid choice.");
        }
    }

    private static void handleAddMember(Scanner scanner, LibraryService service) {
        System.out.print("Enter member name: ");
        String name = scanner.nextLine();

        System.out.print("Enter member email: ");
        String email = scanner.nextLine();

        System.out.print("Enter member phone: ");
        String phone = scanner.nextLine();

        service.addMember(name, email, phone);
    }

    private static void handleIssueBook(Scanner scanner, LibraryService service) {
        System.out.print("Enter book ID to issue: ");
        int bookId = scanner.nextInt();
        System.out.print("Enter member ID: ");
        int memberId = scanner.nextInt();
        scanner.nextLine(); // consume newline

        service.issueBook(bookId, memberId);
    }

    private static void handleReturnBook(Scanner scanner, LibraryService service) {
        System.out.print("Enter loan ID to return: ");
        int loanId = scanner.nextInt();
        scanner.nextLine(); // consume newline
        service.returnBook(loanId);
    }
}
