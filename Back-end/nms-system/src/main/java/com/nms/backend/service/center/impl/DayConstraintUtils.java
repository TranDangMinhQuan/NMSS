package com.nms.backend.service.center.impl;
import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class DayConstraintUtils {

    // Chuyển List<DayOfWeek> thành dayConstraints string
    public static String toDayConstraints(List<DayOfWeek> allowedDays) {
        return IntStream.rangeClosed(1, 7)
                .mapToObj(i -> allowedDays.contains(DayOfWeek.of(i)) ? "1" : "0")
                .collect(Collectors.joining("/"));
    }

    // Chuyển dayConstraints string thành List<DayOfWeek>
    public static List<DayOfWeek> fromDayConstraints(String dayConstraints) {
        String[] parts = dayConstraints.split("/");
        return IntStream.range(0, parts.length)
                .filter(i -> parts[i].equals("1"))
                .mapToObj(i -> DayOfWeek.of(i + 1)) // i=0 → thứ 2
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        // Ví dụ: khách được chơi thứ 2,4,6
        List<DayOfWeek> allowed = List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY);
        String constraints = toDayConstraints(allowed);
        System.out.println("Day Constraints: " + constraints); // Output: 1/0/1/0/1/0/0

        List<DayOfWeek> days = fromDayConstraints(constraints);
        System.out.println("Allowed Days: " + days); // Output: [MONDAY, WEDNESDAY, FRIDAY]
    }
}
