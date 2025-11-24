import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, XCircle, Flag } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  product: string;
  customer: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  date: string;
  helpful: number;
  reported: number;
}

const ProductReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "REV001",
      product: "Wireless Headphones",
      customer: "John Doe",
      rating: 5,
      comment: "Amazing sound quality and comfortable to wear for hours!",
      status: "approved",
      date: "2024-11-12",
      helpful: 24,
      reported: 0
    },
    {
      id: "REV002",
      product: "Running Shoes",
      customer: "Jane Smith",
      rating: 4,
      comment: "Great shoes but sizing runs a bit small.",
      status: "pending",
      date: "2024-11-14",
      helpful: 8,
      reported: 0
    },
    {
      id: "REV003",
      product: "Coffee Maker",
      customer: "Bob Johnson",
      rating: 1,
      comment: "This product is terrible and a complete waste of money!",
      status: "flagged",
      date: "2024-11-15",
      helpful: 2,
      reported: 5
    },
    {
      id: "REV004",
      product: "Wireless Headphones",
      customer: "Sarah Wilson",
      rating: 3,
      comment: "Decent product but battery life could be better.",
      status: "pending",
      date: "2024-11-15",
      helpful: 3,
      reported: 0
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, status: "approved" as const } : r
    ));
    toast.success("Review approved");
  };

  const handleReject = (reviewId: string) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, status: "rejected" as const } : r
    ));
    toast.success("Review rejected");
  };

  const handleFlag = (reviewId: string) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, status: "flagged" as const } : r
    ));
    toast.warning("Review flagged for further review");
  };

  const filteredReviews = reviews.filter(review =>
    review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Product Reviews</h2>
        <p className="text-muted-foreground">Moderate customer reviews and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange">
              {reviews.filter(r => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {reviews.filter(r => r.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {reviews.filter(r => r.status === "flagged").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Helpful</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.id}</TableCell>
                  <TableCell>{review.product}</TableCell>
                  <TableCell>{review.customer}</TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{review.comment}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        review.status === "approved" ? "default" :
                        review.status === "rejected" ? "destructive" :
                        review.status === "flagged" ? "destructive" : "secondary"
                      }
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{review.helpful}</TableCell>
                  <TableCell>
                    {review.reported > 0 && (
                      <span className="text-red-600 font-medium">{review.reported}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedReview(review)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Product</p>
                              <p className="font-medium">{selectedReview?.product}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Customer</p>
                              <p className="font-medium">{selectedReview?.customer}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              {selectedReview && renderStars(selectedReview.rating)}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Comment</p>
                              <p>{selectedReview?.comment}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => selectedReview && handleApprove(selectedReview.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={() => selectedReview && handleReject(selectedReview.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(review.id)}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFlag(review.id)}
                      >
                        <Flag className="w-4 h-4 text-orange" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
