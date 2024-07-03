import mongoose, { Document, Model } from 'mongoose';

interface SocialMedia extends Document {
  name: string;
  title: string;
  path: string;
  message: string;
  enabled: boolean;
}

const socialMediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    title: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });

const SocialMedias: Model<SocialMedia> = mongoose.models.SocialMedias || mongoose.model<SocialMedia>('SocialMedias', socialMediaSchema);

export default SocialMedias;