import { Component, Input, OnChanges } from '@angular/core';
import { ContactContent, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { destinationHref, resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-cta',
  templateUrl: './home-cta.component.html',
  styleUrls: ['./home-cta.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class HomeCtaComponent implements OnChanges {
  @Input() content!: ContactContent;

  meetingAction!: ResolvedAction;
  whatsappAction!: ResolvedAction;
  readonly destinationHref = destinationHref;

  ngOnChanges(): void {
    this.meetingAction = resolveConversionAction(this.content.meetingAction);
    this.whatsappAction = resolveConversionAction(this.content.whatsappAction);
  }
}
